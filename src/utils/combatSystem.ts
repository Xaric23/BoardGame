import type { Player, Enemy, Ability, Item } from '../types/game';

export const performAttack = (attacker: Player | Enemy, defender: Player | Enemy): number => {
  const baseDamage = attacker.stats.attack;
  const actualDamage = Math.max(1, baseDamage - defender.stats.defense);
  defender.stats.currentHealth = Math.max(0, defender.stats.currentHealth - actualDamage);
  return actualDamage;
};

export const useAbility = (player: Player, ability: Ability, target?: Enemy): { damage: number; healing: number; message: string } => {
  let damage = 0;
  let healing = 0;
  let message = `${player.name} used ${ability.name}!`;

  // Check cooldown
  if (ability.currentCooldown > 0) {
    return { damage: 0, healing: 0, message: `${ability.name} is on cooldown for ${ability.currentCooldown} more turns!` };
  }

  // Apply damage
  if (ability.damage && target) {
    damage = Math.max(1, ability.damage - target.stats.defense);
    target.stats.currentHealth = Math.max(0, target.stats.currentHealth - damage);
    message += ` Dealt ${damage} damage!`;
  }

  // Apply healing
  if (ability.healing) {
    const healAmount = Math.min(ability.healing, player.stats.maxHealth - player.stats.currentHealth);
    player.stats.currentHealth += healAmount;
    healing = healAmount;
    message += ` Healed ${healAmount} HP!`;
  }

  // Set cooldown
  ability.currentCooldown = ability.cooldown;

  return { damage, healing, message };
};

export const updateCooldowns = (player: Player): void => {
  player.abilities.forEach((ability) => {
    if (ability.currentCooldown > 0) {
      ability.currentCooldown--;
    }
  });
};

export const pickupItem = (player: Player, item: Item): string => {
  if (item.type === 'treasure') {
    player.gold += item.value;
    return `Found ${item.value} gold!`;
  } else if (item.type === 'potion') {
    const healAmount = Math.min(item.healAmount || 0, player.stats.maxHealth - player.stats.currentHealth);
    player.stats.currentHealth += healAmount;
    return `Used ${item.name} and healed ${healAmount} HP!`;
  } else {
    player.inventory.push(item);

    // Auto-equip if better stats
    if (item.type === 'weapon' && item.attackBonus) {
      player.stats.attack += item.attackBonus;
      return `Equipped ${item.name}! Attack +${item.attackBonus}`;
    } else if (item.type === 'armor' && item.defenseBonus) {
      player.stats.defense += item.defenseBonus;
      return `Equipped ${item.name}! Defense +${item.defenseBonus}`;
    }

    return `Picked up ${item.name}!`;
  }
};

export const checkPlayerDeath = (player: Player): boolean => {
  if (player.stats.currentHealth <= 0) {
    player.isAlive = false;
    return true;
  }
  return false;
};

export const checkEnemyDeath = (enemy: Enemy): boolean => {
  return enemy.stats.currentHealth <= 0;
};

export const gainRewards = (player: Player, enemy: Enemy): string => {
  player.gold += enemy.goldReward;
  return `Defeated ${enemy.name}! Gained ${enemy.goldReward} gold and ${enemy.expReward} exp!`;
};
