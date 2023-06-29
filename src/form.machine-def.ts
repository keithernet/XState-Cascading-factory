import { createMachine } from 'xstate';

export type Events =
  | { type: 'INITIALIZE' }
  | { type: 'FIRST_SELECTED'; data: number }
  | { type: 'SECOND_SELECTED'; data: number }
  | { type: 'THIRD_SELECTED'; data: number }
  | { type: 'SECOND_OPTIONS_LOADED'; data: number[] }
  | { type: 'THIRD_OPTIONS_LOADED'; data: number[] };

function createCascadeNode(childNode = null) {
  const next = !!childNode
    ? childNode
    : { initial: 'done', states: { done: {} } };

  return {
    initial: 'awaitingSelection',
    states: {
      awaitingSelection: {
        on: {
          SELECTED: {
            target: 'selectionMade',
            actions: 'assignSelection',
          },
        },
      },
      selectionMade: next,
      // selectionMade: {
      //   initial: 'loadingSecondOptions',
      //   exit: ['clearSecond'],
      //   on: {
      //     FIRST_SELECTED: {
      //       actions: 'assignFirstSelection',
      //       target: '.loadingSecondOptions',
      //       internal: false,
      //     },
      //   },
      // },
    },
  };
}

export const cascadingSelectControlsMachine = createMachine({
  id: 'cascadingSelectControls',
  context: {
    firstOptions: [1, 2, 3],
    firstSelection: null,
    secondOptions: [] as number[],
    secondSelection: null,
    thirdOptions: [] as number[],
    thirdSelection: null,
  },
  initial: 'awaitingFirstSelection',
  states: {
    awaitingFirstSelection: {
      on: {
        FIRST_SELECTED: {
          target: 'firstSelected',
          actions: 'assignFirstSelection',
        },
      },
    },
    firstSelected: {
      initial: 'loadingSecondOptions',
      exit: ['clearSecond'],
      on: {
        FIRST_SELECTED: {
          actions: 'assignFirstSelection',
          target: '.loadingSecondOptions',
          internal: false,
        },
      },
      states: {
        loadingSecondOptions: {
          invoke: {
            src: 'fetchSecondOptions',
            onDone: {
              actions: 'assignSecondOptions',
              target: 'awaitingSecondSelection',
            },
          },
        },
        awaitingSecondSelection: {
          on: {
            SECOND_SELECTED: {
              actions: 'assignSecondSelection',
              target: 'secondSelected',
            },
          },
        },
        secondSelected: {
          initial: 'loadingThirdOptions',
          on: {
            SECOND_SELECTED: {
              actions: 'assignSecondSelection',
              target: '.loadingThirdOptions',
              internal: false,
            },
          },
          exit: ['clearThird'],
          states: {
            loadingThirdOptions: {
              invoke: {
                src: 'fetchThirdOptions',
                onDone: {
                  actions: 'assignThirdOptions',
                  target: 'awaitingThirdSelection',
                },
              },
            },
            awaitingThirdSelection: {
              on: {
                THIRD_SELECTED: {
                  target: 'thirdSelected',
                  actions: 'assignThirdSelection',
                },
              },
            },
            thirdSelected: {},
          },
        },
      },
    },
  },
});
