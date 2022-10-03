use anchor_lang::prelude::*;

#[derive(Debug, Default)]
#[account]
pub struct UserProfile {
    pub user_address: Pubkey,
    pub post_count: u32,
}

#[derive(Debug, Default)]
#[account]
pub struct BlogPost {
    pub posted_by: Pubkey,
    pub content: String,
    pub like: u8,
}