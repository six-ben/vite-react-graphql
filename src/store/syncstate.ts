class State {
  private _routingFetching = false;
  private _unloaded = false;
  private _pathParams: Record<string, string> = {};

  get isRoutingFetching() {
    return this._routingFetching;
  }

  setRoutingFetching(v: boolean) {
    this._routingFetching = v;
  }

  get isUnloaded() {
    return this._unloaded;
  }

  setUnloaded(v: boolean) {
    this._unloaded = v;
  }

  get pathParams() {
    return this._pathParams;
  }

  setPathParams(v: Record<string, string>) {
    this._pathParams = v;
  }
}

export const syncState = new State();

window.addEventListener('beforeunload', () => {
  syncState.setUnloaded(true);
});
