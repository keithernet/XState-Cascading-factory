import './style.css';

import { FormMachineHost } from './form.machine-host';

var host = new FormMachineHost();

host.currentState.subscribe(ctx => 
    document.getElementById('state')!.innerHTML = JSON.stringify(ctx, null, 2));
host.context.subscribe(ctx => 
    document.getElementById('context')!.innerHTML = JSON.stringify(ctx, null, 2));

host.state.subscribe(s => console.log(host.service.getSnapshot().nextEvents));

document.getElementById('first')!.addEventListener('click', () => host.firstSelected());
document.getElementById('second')!.addEventListener('click', () => host.secondSelected());
document.getElementById('third')!.addEventListener('click', () => host.thirdSelected());
document.getElementById('init')!.addEventListener('click', () => host.init());