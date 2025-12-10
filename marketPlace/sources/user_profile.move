// ============================================================================
// USER PROFILE MODULE
// ============================================================================
module marketplace::user_profile {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;

    // ========== STRUCTS ==========
    
    /// User profile stored on-chain, references Walrus for full data
    public struct UserProfile has key, store {
        id: UID,
        owner: address,              // Wallet address of profile owner
        walrus_blob_id: String,      // Walrus blob ID containing profile JSON
        created_at: u64,             // Epoch when profile was created
        updated_at: u64,             // Last update epoch
    }

    // ========== EVENTS ==========
    
    /// Emitted when a new profile is created
    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        walrus_blob_id: String,
    }

    /// Emitted when a profile is updated
    public struct ProfileUpdated has copy, drop {
        profile_id: ID,
        owner: address,
        new_walrus_blob_id: String,
    }

    // ========== PUBLIC FUNCTIONS ==========
    
    /// Create a new user profile
    /// @param walrus_blob_id: Walrus blob ID containing profile metadata JSON
    entry fun create_profile(
        walrus_blob_id: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let profile_uid = object::new(ctx);
        let profile_id = object::uid_to_inner(&profile_uid);
        
        let profile = UserProfile {
            id: profile_uid,
            owner: sender,
            walrus_blob_id,
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
        };
        
        // Emit event
        event::emit(ProfileCreated {
            profile_id,
            owner: sender,
            walrus_blob_id,
        });
        
        // Transfer profile to creator
        transfer::transfer(profile, sender);
    }

    /// Update existing profile with new Walrus blob
    /// @param profile: Mutable reference to user's profile
    /// @param new_walrus_blob_id: New Walrus blob ID with updated data
    entry fun update_profile(
        profile: &mut UserProfile,
        new_walrus_blob_id: String,
        ctx: &mut TxContext
    ) {
        // Only owner can update
        assert!(profile.owner == tx_context::sender(ctx), 0);
        
        profile.walrus_blob_id = new_walrus_blob_id;
        profile.updated_at = tx_context::epoch(ctx);
        
        // Emit event
        event::emit(ProfileUpdated {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
            new_walrus_blob_id,
        });
    }

    // ========== VIEW FUNCTIONS ==========
    
    /// Get profile's Walrus blob ID
    public fun get_blob_id(profile: &UserProfile): String {
        profile.walrus_blob_id
    }

    /// Get profile owner
    public fun get_owner(profile: &UserProfile): address {
        profile.owner
    }

   
}