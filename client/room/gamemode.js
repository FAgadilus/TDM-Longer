// === Team Death Match Infinite ===
// Работает в мобильной версии Pixel Combats 2

// === Настройка карт и команд ===
GameMode.MapsPool = true; // включает выбор карты
GameMode.TeamMode = true; // включает выбор команды
GameMode.RespawnTime = 3; // секунды возрождения
GameMode.SetTime(0); // бесконечное время
GameMode.FriendlyFire = false; // без урона своим

// === Создаём команды ===
Teams.Clear();

const red = Teams.Add("Red");
red.Color = { r: 1, g: 0, b: 0 };
red.Spawns.SpawnPointsGroups.Add(1);
red.Spawns.DefaultSpawn = true;
red.Build.BlocksSet = "RedTeam";
red.Build.CanBuild = true;

const blue = Teams.Add("Blue");
blue.Color = { r: 0, g: 0, b: 1 };
blue.Spawns.SpawnPointsGroups.Add(2);
blue.Build.BlocksSet = "BlueTeam";
blue.Build.CanBuild = true;

// === При старте матча ===
GameMode.OnStart.Add(() => {
    red.Scores.Value = 0;
    blue.Scores.Value = 0;
});

// === Подсчёт убийств ===
Players.OnKill.Add((killer, victim) => {
    if (killer.Team && victim.Team && killer.Team !== victim.Team) {
        killer.Team.Scores.Add(1);
    }
});

// === Авто-добавление в команду при входе ===
GameMode.OnPlayerConnected.Add(player => {
    const redCount = red.Players.Count;
    const blueCount = blue.Players.Count;
    const team = redCount <= blueCount ? red : blue;
    team.AddPlayer(player);
    player.Spawns.Spawn();
});