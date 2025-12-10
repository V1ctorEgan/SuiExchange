module marketplace::governance {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::table::{Self, Table};
    use std::string::String;

    // ========== STRUCTS ==========
    
    /// Governance proposal
    public struct Proposal has key, store {
        id: UID,
        title: String,
        walrus_blob_id: String,       // Full proposal details on Walrus
        proposer: address,
        votes_for: u64,
        votes_against: u64,
        voters: Table<address, bool>, // Track who voted (true = for, false = against)
        active: bool,
        created_at: u64,
        voting_ends_at: u64,
    }

    // ========== EVENTS ==========
    
    public struct ProposalCreated has copy, drop {
        proposal_id: ID,
        title: String,
        proposer: address,
    }

    public struct VoteCast has copy, drop {
        proposal_id: ID,
        voter: address,
        vote_for: bool,
    }

    public struct ProposalExecuted has copy, drop {
        proposal_id: ID,
        passed: bool,
    }

    // ========== PUBLIC FUNCTIONS ==========
    
    /// Create a new proposal
    entry fun create_proposal(
        title: String,
        walrus_blob_id: String,
        voting_duration_epochs: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let proposal_uid = object::new(ctx);
        let proposal_id = object::uid_to_inner(&proposal_uid);
        let current_epoch = tx_context::epoch(ctx);
        
        let proposal = Proposal {
            id: proposal_uid,
            title,
            walrus_blob_id,
            proposer: sender,
            votes_for: 0,
            votes_against: 0,
            voters: table::new(ctx),
            active: true,
            created_at: current_epoch,
            voting_ends_at: current_epoch + voting_duration_epochs,
        };
        
        event::emit(ProposalCreated {
            proposal_id,
            title,
            proposer: sender,
        });
        
        transfer::share_object(proposal);
    }

    /// Vote on a proposal
    entry fun vote(
        proposal: &mut Proposal,
        vote_for: bool,
        ctx: &mut TxContext
    ) {
        let voter = tx_context::sender(ctx);
        let current_epoch = tx_context::epoch(ctx);
        
        // Checks
        assert!(proposal.active, 1); // Proposal must be active
        assert!(current_epoch <= proposal.voting_ends_at, 2); // Voting period not ended
        assert!(!table::contains(&proposal.voters, voter), 3); // Can't vote twice
        
        // Record vote
        table::add(&mut proposal.voters, voter, vote_for);
        
        if (vote_for) {
            proposal.votes_for = proposal.votes_for + 1;
        } else {
            proposal.votes_against = proposal.votes_against + 1;
        };
        
        event::emit(VoteCast {
            proposal_id: object::uid_to_inner(&proposal.id),
            voter,
            vote_for,
        });
    }

    /// Execute proposal (finalize voting)
    public  fun execute_proposal(
        proposal: &mut Proposal,
        ctx: &TxContext
    ) {
        let current_epoch = tx_context::epoch(ctx);
        
        // Checks
        assert!(proposal.active, 1);
        assert!(current_epoch > proposal.voting_ends_at, 4); // Voting must be ended
        
        proposal.active = false;
        
        let passed = proposal.votes_for > proposal.votes_against;
        
        event::emit(ProposalExecuted {
            proposal_id: object::uid_to_inner(&proposal.id),
            passed,
        });
    }

    // ========== VIEW FUNCTIONS ==========
    
    public fun get_votes(proposal: &Proposal): (u64, u64) {
        (proposal.votes_for, proposal.votes_against)
    }

    public fun has_voted(proposal: &Proposal, voter: address): bool {
        table::contains(&proposal.voters, voter)
    }

    public fun is_active(proposal: &Proposal): bool {
        proposal.active
    }
}