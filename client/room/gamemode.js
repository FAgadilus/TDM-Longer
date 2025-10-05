import { GameMode, Teams, Players } from 'pixel_combats/room';
import { game_mode_length_seconds } from './default_timer.js';
import { setup_default_teams } from './default_teams.js';

// === Настройка команд ===
setup_default_teams();

// === Основные параметры ===
GameMode.MapsPool = true; // активируем MapRotation из JSON
GameMode.RespawnTime = 3;
GameMode.CanDropWeapons = false;

// === Настройки урона ===
Teams.OnRequestJoinTeam.Add(function (player, team) {
    player.Spawns.Spawn();
});

// === Логика таймера ===
const match_length = game_mode_length_seconds();

if (match_length !== Infinity) {
    GameMode.SetTime(match_length); // если не бесконечный
    GameMode.OnTimeEnd.Add(() => {
        GameMode.End(); // завершение матча по времени
    });
} else {
    GameMode.SetTime(0); // бесконечно — без ограничения
}

// === Подсчёт очков ===
Players.OnKill.Add((killer, victim) => {
    if (killer.Team && victim.Team && killer.Team !== victim.Team) {
        killer.Team.Scores.Add(1);
    }

    // проверка победы (например, 100 убийств)
    if (killer.Team && killer.Team.Scores.Value >= 100) {
        GameMode.End();
    }
});

// === Когда матч завершён ===
GameMode.OnEnd.Add(() => {
    // Очистка и показ победителя
    const winner = Teams.GetWinner();
    if (winner) {
        GameMode.AnnounceWinner(winner);
    }
});