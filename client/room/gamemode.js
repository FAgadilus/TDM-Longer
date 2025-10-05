import { DisplayValueHeader } from 'pixel_combats/basic';
import { Game, Players, Inventory, LeaderBoard, BuildBlocksSet, Teams, Damage, BreackGraph, Ui, Properties, GameMode, Spawns, Timers, TeamsBalancer } from 'pixel_combats/room';
import * as teams from './default_teams.js';
import * as default_timer from './default_timer.js';

const KILL_SCORES = 5;
const TIMER_SCORES = 5;
const SCORES_TIMER_INTERVAL = 30;
const immortalityTimerName = "immortality";
const KILLS_PROP_NAME = "Kills";
const SCORES_PROP_NAME = "Scores";
const GameModeTime = default_timer.game_mode_length_seconds();

const mainTimer = Timers.GetContext().Get("Main");
const scores_timer = Timers.GetContext().Get("Scores");

Damage.GetContext().FriendlyFire.Value = GameMode.Parameters.GetBool("FriendlyFire");
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool("LoosenBlocks");
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool("OnlyPlayerBlocksDmg");
BreackGraph.PlayerBlockBoost = true;

TeamsBalancer.IsAutoBalance = true;
Ui.GetContext().MainTimerId.Value = mainTimer.Id;

// создаем стандартные команды
const blueTeam = teams.create_team_blue();
const redTeam = teams.create_team_red();
blueTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue;
redTeam.Build.BlocksSet.Value = BuildBlocksSet.Red;

// лидерборд
LeaderBoard.PlayerLeaderBoardValues = [
    new DisplayValueHeader(KILLS_PROP_NAME, "Statistics/Kills", "Statistics/KillsShort"),
    new DisplayValueHeader("Deaths", "Statistics/Deaths", "Statistics/DeathsShort"),
    new DisplayValueHeader("Spawns", "Statistics/Spawns", "Statistics/SpawnsShort"),
    new DisplayValueHeader(SCORES_PROP_NAME, "Statistics/Scores", "Statistics/ScoresShort")
];
LeaderBoard.TeamLeaderBoardValue = new DisplayValueHeader(SCORES_PROP_NAME, "Statistics/Scores", "Statistics/Scores");

LeaderBoard.TeamWeightGetter.Set(team => team.Properties.Get(SCORES_PROP_NAME).Value);
LeaderBoard.PlayersWeightGetter.Set(player => player.Properties.Get(SCORES_PROP_NAME).Value);

Ui.GetContext().TeamProp1.Value = { Team: "Blue", Prop: SCORES_PROP_NAME };
Ui.GetContext().TeamProp2.Value = { Team: "Red", Prop: SCORES_PROP_NAME };

// команды и спавн
Teams.OnRequestJoinTeam.Add((player, team) => team.Add(player));
Teams.OnPlayerChangeTeam.Add(player => player.Spawns.Spawn());

Spawns.GetContext().OnSpawn.Add(player => {
    player.Properties.Immortality.Value = true;
    player.Timers.Get(immortalityTimerName).Restart(3);
});
Timers.OnPlayerTimer.Add(timer => {
    if (timer.Id === immortalityTimerName)
        timer.Player.Properties.Immortality.Value = false;
});

Damage.OnDeath.Add(player => ++player.Properties.Deaths.Value);
Damage.OnKill.Add((player, killed) => {
    if (killed.Team && killed.Team !== player.Team) {
        ++player.Properties.Kills.Value;
        player.Properties.Scores.Value += KILL_SCORES;
        player.Team.Properties.Get(SCORES_PROP_NAME).Value += KILL_SCORES;
    }
});

scores_timer.OnTimer.Add(() => {
    for (const player of Players.All)
        if (player.Team)
            player.Properties.Scores.Value += TIMER_SCORES;
});

function startGame() {
    Ui.GetContext().Hint.Value = "Hint/AttackEnemies";
    Damage.GetContext().DamageOut.Value = true;

    const inventory = Inventory.GetContext();
    inventory.Main.Value = true;
    inventory.Secondary.Value = true;
    inventory.Melee.Value = true;
    inventory.Explosive.Value = true;
    inventory.Build.Value = true;

    if (GameModeTime > 0)
        mainTimer.Restart(GameModeTime);
    else
        mainTimer.Stop(); // 💫 бесконечное время

    Spawns.GetContext().enable = true;
    for (const team of Teams)
        Spawns.GetContext(team).Spawn();
}

startGame();
scores_timer.RestartLoop(SCORES_TIMER_INTERVAL);