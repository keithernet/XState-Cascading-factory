import { interpret, assign, spawn } from "xstate";

import {
  cascadingSelectControlsMachine,
  editMachine,
} from "./form.machine-def";
import { from } from "rxjs";
import { map } from "rxjs/operators";

export class FormMachineHost {
  private cascadingMachine = cascadingSelectControlsMachine.withConfig({
    services: {
      fetchSecondOptions: () => Promise.resolve([3, 4, 5]),
      fetchThirdOptions: () => Promise.resolve([6, 7, 8]),
    },
    actions: {
      clearSecond: assign({ secondSelection: null, secondOptions: [] }),
      clearThird: assign({ thirdSelection: null, thirdOptions: [] }),
      assignSecondOptions: assign({
        secondOptions: (_, event) => event.data,
      }),
      assignThirdOptions: assign({
        thirdOptions: (_, event) => event.data,
      }),
      assignFirstSelection: assign({
        firstSelection: (_, evt) => evt.data,
      }),
      assignSecondSelection: assign({
        secondSelection: (_, evt) => evt.data,
      }),
      assignThirdSelection: assign({
        thirdSelection: (_, evt) => evt.data,
      }),
    },
  });

  service = interpret(this.cascadingMachine).start();

  state = from(this.service);

  context = this.state.pipe(
    map((state) => state.context)
  );
  currentState = this.state.pipe(map((state) => state.value));

  firstSelected() {
    this.service.send({ type: "FIRST_SELECTED", data: 1 });
  }

  secondSelected() {
    this.service.send({ type: "SECOND_SELECTED", data: 9 });
  }

  thirdSelected() {
    this.service.send({ type: "THIRD_SELECTED", data: 2 });
  }
  init() {
    this.service.send({ type: "INITIALIZE" });
  }
}
