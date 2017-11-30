import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const Fragment = props => props.children;

// TODO: document component usage && check code in detail
export default class SelectBox_ListPreview extends PureComponent {
    static propTypes = {
        onCreateNew: PropTypes.func,
        searchTerm: PropTypes.string,
        // dependency injection
        SelectBox_ListPreviewUngrouped: PropTypes.any.isRequired
    }

    render() {
        const {
            onCreateNew,
            searchTerm,
            SelectBox_CreateNew,
            SelectBox_ListPreviewUngrouped
        } = this.props;

        

        // TODO: check whether we have grouped elements in the list; then render <ListPreviewGrouped> instead!
        return (
            <Fragment>
                <SelectBox_ListPreviewUngrouped {...this.props} />
                <SelectBox_CreateNew {...this.props} />
            </Fragment>
        );
    }
}
