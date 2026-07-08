#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Symbol};

#[cfg(test)]
mod test;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Total,
}

#[contract]
pub struct TipJar;

#[contractimpl]
impl TipJar {
    pub fn add_tip(env: Env, amount: i128) -> i128 {
        let mut total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Total)
            .unwrap_or(0);

        total += amount;

        env.storage().instance().set(&DataKey::Total, &total);

        env.events().publish(
            (symbol_short!("tip"), symbol_short!("added")),
            (amount, total),
        );

        total
    }

    pub fn get_total(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::Total)
            .unwrap_or(0)
    }

    pub fn reset(env: Env) {
        env.storage().instance().set(&DataKey::Total, &0i128);
    }
}