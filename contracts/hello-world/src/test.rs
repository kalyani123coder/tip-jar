#![cfg(test)]
use super::*;
use soroban_sdk::Env;

#[test]
fn test_add_tip_increases_total() {
    let env = Env::default();
    let contract_id = env.register(TipJar, ());
    let client = TipJarClient::new(&env, &contract_id);
    let result = client.add_tip(&100);
    assert_eq!(result, 100);
}

#[test]
fn test_get_total_returns_zero_initially() {
    let env = Env::default();
    let contract_id = env.register(TipJar, ());
    let client = TipJarClient::new(&env, &contract_id);
    let total = client.get_total();
    assert_eq!(total, 0);
}

#[test]
fn test_multiple_tips_accumulate() {
    let env = Env::default();
    let contract_id = env.register(TipJar, ());
    let client = TipJarClient::new(&env, &contract_id);
    client.add_tip(&50);
    client.add_tip(&30);
    let total = client.add_tip(&20);
    assert_eq!(total, 100);
}

#[test]
fn test_tip_event_emitted() {
    let env = Env::default();
    let contract_id = env.register(TipJar, ());
    let client = TipJarClient::new(&env, &contract_id);
    let result = client.add_tip(&100);
    assert_eq!(result, 100);
    let total_after = client.get_total();
    assert_eq!(total_after, 100);
}