import Component from './index';

/**
 * The child toggle component handles toggling child component enable/dissable states.
 * Only one child component can be enabled after calling toggle.
 */
export class ChildToggle extends Component {

    /**
     * Dissables all child components except for the passed child.
     * @param {Component|string} page 
     */
    async toggle(child) {
        child = this.getChild(child);

        if ( child ) {
            this.getChildren().forEach((c) => c.enabled = c === child);

            await this.send("onToggleChild", child);
            await child.update();
            await this.send("onAfterToggleChild", child);
        }
    }
}

export class Event {
    constructor(isCancelable) {
        this._isCancelable = isCancelable?true:false;
        this._wasCanceled = false;
    }

    get isCancelable() {
        return this._isCancelable;
    }

    get wasCanceled() {
        return this._wasCanceled;
    }

    cancel() {
        if ( this._isCancelable ) {
            this._wasCanceled = true;
        } else {
            throw new error("This event is not cancelable");
        }
    }
}