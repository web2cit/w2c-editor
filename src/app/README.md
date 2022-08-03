The state is managed by Redux.

The thunk middleware gets an extra argument which is a wrapper of the Web2Cit
logic.

We have three config slices, all implementing the same configSlice class.

The save config action
In the final version, it would send the config to the API, and wait for a revid
In the meantime, we may have a manual save property in the corresponding config state
and have the UI react to it.
This special UI should refresh config metadata after closing

---

We have an output slice, including both translation outputs and path sorting.

Path sorting should be immediate, but we don't have access to the Domain object.

Some actions and selectors affect multiple slices. Thus, we may define them in
the store file: