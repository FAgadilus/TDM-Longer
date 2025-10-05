import { Teams, Properties } from 'pixel_combats/room';

// стандартные команды — синяя и красная
export function create_team_blue() {
    const team = Teams.Add("Blue", "Teams/Blue");
    team.Properties.Spawns.Value = 0;
    team.Properties.Kills.Value = 0;
    team.Properties.Deaths.Value = 0;
    team.Properties.Scores.Value = 0;
    return team;
}

export function create_team_red() {
    const team = Teams.Add("Red", "Teams/Red");
    team.Properties.Spawns.Value = 0;
    team.Properties.Kills.Value = 0;
    team.Properties.Deaths.Value = 0;
    team.Properties.Scores.Value = 0;
    return team;
}
