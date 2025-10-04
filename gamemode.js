// библиотека для работы со стандартными длинами матчей

import { GameMode } from 'pixel_combats/room';

// константы
const PARAMETER_GAME_LENGTH = 'default_game_mode_length';

// возвращает длину матча
export function game_mode_length_seconds() {
    const length = GameMode.Parameters.GetString(PARAMETER_GAME_LENGTH);
    switch (length) {
        case '1h': return 3600; // 4 min
        case '2h': return 7200; // 5 min
        case '3h': return 10800; // 6 min
        case '5h': return 18000; // 7 min
    }
    return 300;
}