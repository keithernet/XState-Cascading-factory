import { interval } from "rxjs";
import { map } from "rxjs/operators";

export interface FormValue {
  greeting: string;
  value: number;
}

// we define form groups in classes that we can inject in both
// the machine and the component where we will use it. validators
// and things also go here
export class Form {
  // simulate a user entering form values with an interval
  valuesChanges = interval(500).pipe(map(this.getNewFormValue));

  private getNewFormValue(time: number): FormValue {
    return {
      greeting: `Hey, it's ${time}`,
      value: time,
    };
  }
}
