use anchor_lang::prelude::*;

use crate::state::{ UserProfile, BlogPost };

#[derive(Accounts)]
pub struct CreateUserAccount<'info> {
    #[account(
        init,
        payer = user,
        seeds = [b"userProfile".as_ref(), user.key().as_ref()],
        bump,
        space = std::mem::size_of::<UserProfile>()
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = user,
        seeds = [
            b"userPost".as_ref(),
            user.key().as_ref(),
            &[user_profile.post_count as u8].as_ref(),
        ],
        bump,
        space = std::mem::size_of::<BlogPost>()
    )]
    pub blog_post: Account<'info, BlogPost>,
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}