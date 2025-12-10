module marketplace::nft {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use std::string::String;

    // ========== STRUCTS ==========
    
    /// NFT with metadata stored on Walrus
    public struct MarketplaceNFT has key, store {
        id: UID,
        name: String,
        walrus_blob_id: String,       // NFT metadata + image on Walrus
        creator: address,
        minted_at: u64,
    }

    /// NFT listing for sale
    public struct NFTListing has key, store {
        id: UID,
        nft_id: ID,                   // Which NFT is being sold
        seller: address,
        price: u64,
        active: bool,
    }

    // ========== EVENTS ==========
    
    public struct NFTMinted has copy, drop {
        nft_id: ID,
        name: String,
        creator: address,
    }

    public struct NFTListed has copy, drop {
        nft_id: ID,
        seller: address,
        price: u64,
    }

    public struct NFTSold has copy, drop {
        nft_id: ID,
        seller: address,
        buyer: address,
        price: u64,
    }

    // ========== PUBLIC FUNCTIONS ==========
    
    /// Mint a new NFT
    entry fun mint_nft(
        name: String,
        walrus_blob_id: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft_uid = object::new(ctx);
        let nft_id = object::uid_to_inner(&nft_uid);
        
        let nft = MarketplaceNFT {
            id: nft_uid,
            name,
            walrus_blob_id,
            creator: sender,
            minted_at: tx_context::epoch(ctx),
        };
        
        event::emit(NFTMinted {
            nft_id,
            name,
            creator: sender,
        });
        
        // Transfer NFT to creator
        transfer::transfer(nft, sender);
    }

    /// List NFT for sale
    entry fun list_nft(
        nft: MarketplaceNFT,
        price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft_id = object::uid_to_inner(&nft.id);
        
        // Create listing
        let listing = NFTListing {
            id: object::new(ctx),
            nft_id,
            seller: sender,
            price,
            active: true,
        };
        
        event::emit(NFTListed {
            nft_id,
            seller: sender,
            price,
        });
        
        // Transfer NFT to listing (escrowed)
        transfer::transfer(nft, tx_context::sender(ctx));
        
        // Make listing shared
        transfer::share_object(listing);
    }

    /// Buy NFT from listing
    entry fun buy_nft(
        listing: &mut NFTListing,
        nft: MarketplaceNFT,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let buyer = tx_context::sender(ctx);
        
        // Checks
        assert!(listing.active, 1);
        assert!(coin::value(&payment) >= listing.price, 2);
        assert!(object::uid_to_inner(&nft.id) == listing.nft_id, 5);
        
        // Transfer payment to seller
        transfer::public_transfer(payment, listing.seller);
        
        // Transfer NFT to buyer
        transfer::transfer(nft, buyer);
        
        // Mark listing as sold
        listing.active = false;
        
        event::emit(NFTSold {
            nft_id: listing.nft_id,
            seller: listing.seller,
            buyer,
            price: listing.price,
        });
    }

    /// Cancel NFT listing
    entry fun cancel_nft_listing(
        listing: &mut NFTListing,
        nft: MarketplaceNFT,
        ctx: &TxContext
    ) {
        assert!(listing.seller == tx_context::sender(ctx), 0);
        assert!(listing.active, 4);
        assert!(object::uid_to_inner(&nft.id) == listing.nft_id, 5);
        
        listing.active = false;
        
        // Return NFT to seller
        transfer::transfer(nft, listing.seller);
    }
}

