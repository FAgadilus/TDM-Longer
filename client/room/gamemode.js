import { GameMode, Players } from 'pixel_combats/room';
import { setup_default_teams } from './default_teams.js';
import { game_mode_length_seconds } from './default_timer.js';

// --- Основные параметры ---
GameMode.MapsPool = true; // чтобы работали карты
GameMode.RespawnTime = 3;

// --- Команды ---
setup_default_teams();

// --- Таймер ---
const length = game_mode_length_seconds();
if (length > 0) {
    GameMode.SetTime(length);
    GameMode.OnTimeEnd.Add(() => GameMode.End());
} else {
    GameMode.SetTime(0); // бесконечно
}

// --- Подсчёт очков ---
Players.OnKill.Add((killer, victim) => {
    if (killer.Team && victim.Team && killer.Team !== victim.Team) {
        killer.Team.Scores.Add(1);
    }

    if (killer.Team && killer.Team.Scores.Value >= 100) {
        GameMode.End();
    }
});