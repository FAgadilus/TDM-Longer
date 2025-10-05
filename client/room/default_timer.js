import { GameMode } from 'pixel_combats/room';

const PARAMETER_GAME_LENGTH = 'default_game_mode_length';

export function game_mode_length_seconds() {
    const length = GameMode.Parameters.GetString(PARAMETER_GAME_LENGTH);
    switch (length) {
        case '1h': return 3600;
        case '2h': return 7200;
        case '3h': return 10800;
        case '5h': return 18000;
        case '∞': return 0; // 0 = бесконечно, чтобы не ломался таймер
    }
    return 0;
}