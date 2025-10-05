// стандартная настройка команд для TDM

import { Teams, GameMode } from 'pixel_combats/room';

// создаёт стандартные команды (Красная и Синяя)
export function setup_default_teams() {
    // --- Удаляем старые команды (если есть) ---
    Teams.Clear();

    // --- Создаём команду Red ---
    const red = Teams.Add('Red');
    red.Color = { r: 1, g: 0, b: 0 }; // красный цвет
    red.Spawns.SpawnPointsGroups.Add(1);
    red.Spawns.DefaultSpawn = true;
    red.Build.BlocksSet = 'RedTeam';
    red.Build.CanBuild = true;

    // --- Создаём команду Blue ---
    const blue = Teams.Add('Blue');
    blue.Color = { r: 0, g: 0, b: 1 }; // синий цвет
    blue.Spawns.SpawnPointsGroups.Add(2);
    blue.Build.BlocksSet = 'BlueTeam';
    blue.Build.CanBuild = true;

    // --- Баланс игроков при заходе ---
    Teams.OnRequestJoinTeam.Add((player, team) => {
        if (!team) return true; // если нет выбранной команды
        const redCount = Teams.Get('Red').Players.Count;
        const blueCount = Teams.Get('Blue').Players.Count;
        if (redCount > blueCount && team.Name === 'Red') return false;
        if (blueCount > redCount && team.Name === 'Blue') return false;
        return true;
    });

    // --- Автоматическая команда при входе ---
    GameMode.OnPlayerConnected.Add(player => {
        const redCount = Teams.Get('Red').Players.Count;
        const blueCount = Teams.Get('Blue').Players.Count;
        const team = redCount <= blueCount ? Teams.Get('Red') : Teams.Get('Blue');
        team.AddPlayer(player);
        player.Spawns.Spawn();
    });

    // --- Очистка очков при старте матча ---
    GameMode.OnStart.Add(() => {
        Teams.Get('Red').Scores.Value = 0;
        Teams.Get('Blue').Scores.Value = 0;
    });
}