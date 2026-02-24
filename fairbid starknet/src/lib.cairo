use starknet::ContractAddress;

#[starknet::interface]
pub trait IFairBid<TContractState> {
    fn commit_bid(ref self: TContractState, commitment: felt252, deposit: u256);
    fn reveal_bid(ref self: TContractState, amount: u256, secret: felt252);
    fn start_reveal_phase(ref self: TContractState);
    fn finalize_auction(ref self: TContractState);
    fn get_phase(self: @TContractState) -> u8;
    fn get_highest_bid(self: @TContractState) -> u256;
    fn get_highest_bidder(self: @TContractState) -> ContractAddress;
    fn get_commitment(self: @TContractState, bidder: ContractAddress) -> felt252;
    fn get_revealed_bid(self: @TContractState, bidder: ContractAddress) -> u256;
    fn get_deposit(self: @TContractState, bidder: ContractAddress)  -> u256;

}


#[starknet::contract]
pub mod Fairbid {
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use core::hash::poseidon_hash_many;
    use core::Zeroable::Zeroable;
    use openzeppelin::token::erc20::interface{IERC20Dispatcher, IERC20DispatcherTrait};
    
    
    #[storage]
    struct Storage {
        admin: ContractAddress,
        token: ContractAddress, //ERC20 address
        phasee: u8, //0: commit, 1: Reveal, 2: finalized
        commitments: LegacyMap < ContractAddress, felt252>,
        revealed_bids: LegacyMap < ContractAddress, u256>,
        deposits: LegacyMap < ContractAddress, u256>,
        highest_bid: u256,
        highest_bidder: ContractAddress,
        bidders_count: u32,
        bidders: LegacyMap<u32, ContractAddress>,
    }
    
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        BidCommitted: BidCommitted,
        BidRevealed: BidRevealed,
        AuctionFinalized: AuctionFinalized,
    }
    
    #[derive(Drop, starknet::Event)]
    struct BidCommitted {
        bidder: ContractAddress,
        commitment: felt252,
        deposit: u256,
    }
    
    #[derive(Drop, starknet::Event)]
    struct BidRevealed {
        bidder: ContractAddress,
        amount: u256,
    }
    
    #[derive(Drop, starknet::Event)]
    struct AuctionFinalized {
        winner: ContractAddress,
        final_bid: u256,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState, token_address: ContractAddress) {
        self.admin.write(get_caller_address());
        self.token.write(token_address);
        self.phase.write(0);
        self.highest_bid.write(0);
        self.highest_bidder.write(Zeroable::zero());
    }
    
    #[abi(embed_v0)]
    impl FairBidImpl of super::IFairBid<ContractState> {
        fn commit_bid(ref self: ContractState, commitment: felt252, deposit: u256) {
            assert(self.phase.tread() == 0, 'Not in commit phase');
            let bidder = get_caller_address();
            assert(self.commitments.read(bidder) == 0, 'Already committed');
            assert(deposit > 0, 'Deposit must be posittive');
    
            // transfer deposit
            let token = IERC20Dispatcher { contract_address: self.token.read()};
            token.transfer_from(bidder, get_contract_address(), deposit);
    
            //store
            self.commitments.write(bidder, commitment);
            self.deposits.write(bidder, deposit);
    
            let count = self.bidders_count.read();
            self.bidders.write(count, bidder);
            self.bidders_count.write(count + 1);
    
            self.emit(BidCommitted { bidder, commitment, deposit });
        }
    
        fn reveal_bid(ref self: ContractState, amount: u256, secret: felt252) {
            assert(self.phase.read() == 1, 'Not in reveal phase');
            let bidder = get_caller_address();
            let stored_commitment = self.commitments.read(bidder);
            assert(stored_commitment != 0, 'No commitment');
    
            // Recompute hash: amount as [high, low], + secret
            let amount_high = amount_high.into();
            let amount_low = amount_low.into();
            let computed_hash = poseidon_hash_span(@array![amount_low, amount_high, secret]);
    
            assert(computed_hash == stored_commitment, 'Invalid reveal');
            let deposit = self.deposits.read(bidder);
            assert(amount <= deposit, 'Deposit insufficient for bid');
    
            self.revealed_bids.write(bidder, amount);
            self.emit(BidRevealed { bidder, amount });
        }
    
        fn start_reveal_phase(ref self: ContractState) {
            let caller = get_caller_address();
            assert(caller == self.admin.read(), 'Not admin');
            assert(self.phase.read() == 0, 'Not in commit phase');
            self.phase.write(1);
        }
    
        fn finalize_auction(ref self: ContractState) {
            let caller = get_caller_address();
            assert(caller == self.admin.read(), 'Not admin');
            assert(self.phase.read() == 1, 'Not in commit phase');
            
            let mut highest: u256 = 0;
            let mut highest_bidder: ContractAddress = Zeroable::zero();
            let count = self.bidders_count.read();
            leet mut 1: u32 = 0;
            let token = IERC20Dispatcher { contract_address: self.token.read() };
            let contract_addr = get_contract_address();
    
            loop {
                if i == count {
                    break;
                }
                let bidder = self.bidders.read(i);
                let bid = self.revealed_bids.read(bidder);
                if bid > highest {
                    highest = bid;
                    highest_bidder = bidder;
                }
                i += 1;
            };
    
            self.highest_bid.write(highest);
            self.highest_bidder.write(highest_bidder);
    
            // refunds and transfers
            let mut j: u32 = 0;
            loop {
                if j == count {
                    break;
                }
                let bidder = self.bidders.read(j);
                let deposit = self.deposits.read(bidder);
                if bidder == highest_bidder {
                    // transfer bid to admin (creator), refund excess
                    token.transfer(self.admin.read(), highest);
                    if deposit > highest {
                        token.transfer(bidder, deposit - highest);
                    }
                    else if deposit > 0 {
                        // refund loser
                        token.transfer(bidder, deposit);    
                    }
                    j += 1;
                };
    
                self.phase.write(2);
                self.emit(AuctionFinalized { winner: highest_bidder, final_bid: highest});
            }
    
            // view functions
            fn get_phase(self: @ContractState) -> u8 {
                self.phase.read()
            }
            fn get_highest_bid(self: @ContractState) -> u256 {
                self.highest_bid.read()
            }
            fn get_highest_bidder(self: @ContractState) -> ContractAddress {
                self.highest_bidderr.read()
            }
            fn get_commitment(self: @ContractState, bidder: ContractAddress) -> felt252 {
                self.commitments.read(bidder)
            }
            fn get_revealed_bid(self: @ContractState, bidder: ContractAddress) ->u256 {
                sself.revealed_bids.read(bidder)
            }
            fn get_depsit(self: @ContractState, bidder: ContracctAddress) -> u256 {
                self.deposits.read(bidder)
            }
        }
    }
}
