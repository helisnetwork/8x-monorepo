import { NetworkService } from "./types";

import ExecutorStore from './store/executor_events';
import PayrollStore from './store/payroll_events';
import ProcessorStore from "./store/processor";

export default class Repeater {

  private service: NetworkService;

  public executorStore: ExecutorStore;
  public payrollStore: PayrollStore;
  public processorStore: ProcessorStore;

  public repeaterUpdated: () => (void) | null;

  constructor(service: NetworkService) {
    this.service = service;
  }

  public async start() {
    this.executorStore = new ExecutorStore(this.service, () => this.storeUpdated());
    this.payrollStore = new PayrollStore(this.service, () => this.storeUpdated());

    this.processorStore = new ProcessorStore(this.service);

    await this.executorStore.startListening();
    await this.payrollStore.startListening();
  }

  public storeUpdated() {
    let combinedArray = this.payrollStore.getEventsArray().concat(this.executorStore.getEventsArray());
    this.processorStore.setEvents(combinedArray);

    if (this.repeaterUpdated) {
      this.repeaterUpdated();
    }
  }

}