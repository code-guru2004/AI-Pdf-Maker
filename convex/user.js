import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createUser=mutation({
    args:{
        email:v.string(),
        userName:v.string(),
        imageUrl:v.string()
    },
    handler:async (ctx,args)=>{
        //if user already exists
        const user = await ctx.db.query('users').filter((q)=>q.eq(q.field('email') , args.email)).collect();


        //if no user existes
        
        if(user?.length==0){
            await ctx.db.insert('users' , {
                email:args.email,
                userName:args.userName,
                imageUrl:args.imageUrl,
                upgrade:false,
            })

            return 'Inserted New User'
        }

        return 'User already Exists'

    }
});

export const userUpgradePlans = mutation({
    args:{
        userEmail:v.optional(v.string()),
    },
    handler:async(ctx,args)=>{
        if(!args.userEmail){
            return;
        }
        const result = await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args?.userEmail)).collect();
        console.log("result",result[0]);
        
        if(result){
            await ctx.db.patch(result[0]._id,{upgrade:true});
            return 'Success...'
        }
        return 'error payment'
    }
});

export const getUserInfo=query({
    args:{
        userEmail:v.optional(v.string()),
    },
    handler:async(ctx,args)=>{
        if(!args.userEmail){
            return
        }
        const result = await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args?.userEmail)).collect();

        return result[0];
    }
})