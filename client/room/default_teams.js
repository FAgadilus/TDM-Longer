import { Teams, GameMode } from 'pixel_combats/room';

export function setup_default_teams() {
    Teams.Clear();

    const red = Teams.Add('Red');
    red.Color = { r: 1, g: 0, b: 0 };
    red.Spawns.SpawnPointsGroups.Add(1);
    red.Spawns.DefaultSpawn = true;
    red.Build.BlocksSet = 'RedTeam';
    red.Build.CanBuild = true;

    const blue = Teams.Add('Blue');
    blue.Color = { r: 0, g: 0, b: 1 };
    blue.Spawns.SpawnPointsGroups.Add(2);
    blue.Build.BlocksSet = 'BlueTeam';
    blue.Build.CanBuild = true;

    // Выбор команды вручную при входе
    GameMode.OnPlayerConnected.Add(player => {
        player.Ui.ShowTeamSelection(true);
    });

    // Обнуление очков при старте
    GameMode.OnStart.Add(() => {
        red.Scores.Value = 0;
        blue.Scores.Value = 0;
    });
}