#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol, symbol_short};

#[contract]
pub struct TipJar;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Total,
}

#[contractimpl]
impl TipJar {
    // Add a tip amount to the total
    pub fn add_tip(env: Env, amount: i128) -> i128 {
        let mut total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Total)
            .unwrap_or(0);

        total += amount;

        env.storage().instance().set(&DataKey::Total, &total);

        total
    }

    // Get the current total tips collected
    pub fn get_total(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::Total)
            .unwrap_or(0)
    }
}

mod test;