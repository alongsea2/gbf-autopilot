import _ from "lodash";

export default function() {
  return new Promise((resolve, reject) => {
    var state = {};
    this.callAction("battle.count").then((count) => {
      state.battle = count;
      return this.callAction("viramate.combat");
    }, reject).then((combatState) => {
      state = _.assign(state, combatState);
      return this.sendAction("battle.state"); // use sendAction to bypass the assigned battle.state action
    }, reject).then((battleState) => {
      const skillState = battleState.party;
      _.forEach(skillState, (skills, chara) => {
        chara = Number(chara) - 1;
        skills = _.values(skills).sort((a, b) => b.skill - a.skill);
        state.party[chara].skills = skills;
      });

      state.summons = _.values(battleState.summons).sort((a, b) => b.num - a.num);
      resolve(state);
    }, reject);
  });
}
