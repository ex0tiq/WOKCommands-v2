var CooldownTypes;
(function (CooldownTypes) {
    CooldownTypes["perUser"] = "perUser";
    CooldownTypes["perUserPerGuild"] = "perUserPerGuild";
    CooldownTypes["perGuild"] = "perGuild";
    CooldownTypes["global"] = "global";
})(CooldownTypes || (CooldownTypes = {}));
export default CooldownTypes;
