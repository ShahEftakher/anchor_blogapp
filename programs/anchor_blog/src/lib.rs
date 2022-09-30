use anchor_lang::prelude::*;

mod state;
mod instructions;
use crate::instructions::*;

declare_id!("12cvQQzvjJDW7JMiJ71hSnnmMzCo9vM7d7zcmmQtaojW");

#[program]
pub mod anchor_blog {
    use super::*;

    pub fn create_account(ctx: Context<CreateUserAccount>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.user_address = ctx.accounts.user.key();
        user_profile.post_count = 0;
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, _content: String) -> Result<()> {
        let new_post = &mut ctx.accounts.blog_post;
        new_post.posted_by = ctx.accounts.user_profile.key();
        new_post.content = _content;
        new_post.like = 0;
        Ok(())
    }
}