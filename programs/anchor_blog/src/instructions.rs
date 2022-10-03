use anchor_lang::prelude::*;

use crate::state::{ UserProfile, BlogPost };

#[derive(Accounts)]
#[instruction()]
pub struct CreateUserAccount<'info> {
    #[account(
        init,
        payer = user,
        seeds = [b"userProfile".as_ref(), user.key().as_ref()],
        bump,
        space = std::mem::size_of::<UserProfile>() + 8
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
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
        //anchor needs space to differentiate between stacks
        //if no extra spcae is given for that puspose anchror will use from the allocated space
        //that will result into failure of deserializing of instruction
        //so extra 8 byte is given for that purpose
        space = std::mem::size_of::<BlogPost>() + 8
    )]
    pub blog_post: Account<'info, BlogPost>,
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}