import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {actions} from '@neos-project/neos-ui-redux-store';
import {$get} from 'plow-js';
import Immutable from 'immutable';

const EMPTY_LIST = Immutable.fromJS([]);

class DataLoaderClient {
    _dataLoaderIdentifier: '';
    _dataLoaderOptions: null;
    _dataLoaderDefinition: null;

    constructor(dataLoaderIdentifier, dataLoaderOptions, dataLoaderDefinition) {
        this._dataLoaderIdentifier = dataLoaderIdentifier;
        this._dataLoaderOptions = dataLoaderOptions;
        this._dataLoaderDefinition = dataLoaderDefinition;
    }

    doInitialize(currentlySelectedDataIdentifier) {
        return actions.UI.DataLoaders.initialize(this._dataLoaderIdentifier, this._dataLoaderOptions, currentlySelectedDataIdentifier);
    }

    // "instanceId" identifies the invocation location in the application, which triggers "search".
    // it is a string used to cancel previous, still-running search actions with the same instanceId.
    doSearch(instanceId, searchTerm) {
        return actions.UI.DataLoaders.search(this._dataLoaderIdentifier, this._dataLoaderOptions, instanceId, searchTerm);
    }

    isLoading(state) {

    }

    findByIdentifier(identifier, state) {
        const cacheSegment = this._dataLoaderDefinition.cacheSegment(this._dataLoaderOptions, state);
        return $get(['ui', 'dataLoaders', cacheSegment, 'valuesByIdentifier', identifier], state);
    }

    props(currentlySelectedObjectIdentifier, searchTerm, state) {
        let optionValues = EMPTY_LIST;
        if (searchTerm) {
            const cacheSegment = this._dataLoaderDefinition.cacheSegment(this._dataLoaderOptions, state);
            const identifiers = $get(['ui', 'dataLoaders', cacheSegment, 'searchStrings', searchTerm], state);
            // TODO: somehow memoize this!
            if (identifiers) {
                optionValues = identifiers.map(id => $get(['ui', 'dataLoaders', cacheSegment, 'valuesByIdentifier', id], state));
            }
        } else if (currentlySelectedObjectIdentifier) {
            const option = this.findByIdentifier(currentlySelectedObjectIdentifier, state);
            if (option) {
                optionValues = Immutable.fromJS([option]);
            }
        }
        return {
            optionValues,
            isLoading: this.isLoading(state)
        };
    }

    // TODO: findByIdentifiersSelector

    makeListSelector(searchTerm) {

    }
}

export default class DataLoadersRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);
    }

    getClient(dataLoaderIdentifier, dataLoaderOptions) {
        if (!this.has(dataLoaderIdentifier)) {
            throw new Error(`DataLoader with identifier "${dataLoaderIdentifier}" not found.`);
        }
        return new DataLoaderClient(
            dataLoaderIdentifier,
            dataLoaderOptions,
            this.get(dataLoaderIdentifier)
        );
    }
}
