// библиотека для работы со стандартными длинами матчей

import { GameMode } from 'pixel_combats/room';

// константы
const PARAMETER_GAME_LENGTH = 'default_game_mode_length';

// возвращает длину матча в секундах
export function game_mode_length_seconds() {
    const length = GameMode.Parameters.GetString(PARAMETER_GAME_LENGTH);
    switch (length) {
        case '1h': return 3600;
        case '2h': return 7200;
        case '3h': return 10800;
        case '5h': return 18000;
        case '∞':
        case 'infinite':
        case 'none':
            return Infinity; // бесконечное время
    }
    return Infinity;
}