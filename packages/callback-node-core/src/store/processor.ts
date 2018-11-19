import * as admin from 'firebase-admin';
import * as Web3 from 'web3';

import { AddressBook, Address, SubscriptionEvent } from '@8xprotocol/types';

export default class ProcessorStore {

    private web3: Web3;

    public events: SubscriptionEvent[];

    constructor(web3: Web3) {

        
    }

    public setEvents(events: SubscriptionEvent[]) {
        this.events = events.filter((event) => event.cancelled == false);
    
        console.log(`Current events are: ${JSON.stringify(this.events, null, 2)}`);
        console.log(`Executed events are: ${JSON.stringify(this.executedTransactionHashes, null, 2)}`);
      }

}