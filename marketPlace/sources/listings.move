// ============================================================================
// MARKETPLACE MODULE - Skills & Services
// ============================================================================
module marketplace::listings {
    use sui::object::{Self, UID, ID};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;

    // ========== STRUCTS ==========
    
    /// Service listing on the marketplace
    public struct ServiceListing has key, store {
        id: UID,
        seller: address,              // Who is offering the service
        walrus_blob_id: String,       // Service details in Walrus
        price: u64,                   // Price in MIST (1 SUI = 1,000,000,000 MIST)
        active: bool,                 // Is listing available for purchase?
        created_at: u64,
    }

    /// Receipt proving service was purchased
    public struct PurchaseReceipt has key, store {
        id: UID,
        listing_id: ID,               // Which service was purchased
        buyer: address,
        seller: address,
        price_paid: u64,
        purchased_at: u64,
    }

    // ========== EVENTS ==========
    
    public struct ListingCreated has copy, drop {
        listing_id: ID,
        seller: address,
        price: u64,
    }

    public struct ServicePurchased has copy, drop {
        listing_id: ID,
        buyer: address,
        seller: address,
        price: u64,
    }

    public struct ListingCancelled has copy, drop {
        listing_id: ID,
        seller: address,
    }

    // ========== PUBLIC FUNCTIONS ==========
    
    /// Create a new service listing
    entry fun create_listing(
        walrus_blob_id: String,
        price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let listing_uid = object::new(ctx);
        let listing_id = object::uid_to_inner(&listing_uid);
        
        let listing = ServiceListing {
            id: listing_uid,
            seller: sender,
            walrus_blob_id,
            price,
            active: true,
            created_at: tx_context::epoch(ctx),
        };
        
        event::emit(ListingCreated {
            listing_id,
            seller: sender,
            price,
        });
        
        // Make listing shared so anyone can purchase
        transfer::share_object(listing);
    }

    /// Purchase a service
    entry fun purchase_service(
        listing: &mut ServiceListing,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let buyer = tx_context::sender(ctx);
        
        // Checks
        assert!(listing.active, 1); // Listing must be active
        assert!(coin::value(&payment) >= listing.price, 2); // Must pay enough
        assert!(buyer != listing.seller, 3); // Can't buy your own service
        
        // Transfer payment to seller
        transfer::public_transfer(payment, listing.seller);
        
        // Mark listing as sold
        listing.active = false;
        
        // Create receipt for buyer
        let receipt = PurchaseReceipt {
            id: object::new(ctx),
            listing_id: object::uid_to_inner(&listing.id),
            buyer,
            seller: listing.seller,
            price_paid: listing.price,
            purchased_at: tx_context::epoch(ctx),
        };
        
        event::emit(ServicePurchased {
            listing_id: object::uid_to_inner(&listing.id),
            buyer,
            seller: listing.seller,
            price: listing.price,
        });
        
        transfer::transfer(receipt, buyer);
    }

    /// Cancel your listing (seller only)
    entry fun cancel_listing(
        listing: &mut ServiceListing,
        ctx: &TxContext
    ) {
        assert!(listing.seller == tx_context::sender(ctx), 0);
        assert!(listing.active, 4); // Can only cancel active listings
        
        listing.active = false;
        
        event::emit(ListingCancelled {
            listing_id: object::uid_to_inner(&listing.id),
            seller: listing.seller,
        });
    }

    // ========== VIEW FUNCTIONS ==========
    
    public fun is_active(listing: &ServiceListing): bool {
        listing.active
    }

    public fun get_price(listing: &ServiceListing): u64 {
        listing.price
    }

    public fun get_seller(listing: &ServiceListing): address {
        listing.seller
    }
}
