import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styles from './tree-node-renderer.scss';

class MinimalThemeTreeNodeRenderer extends Component {
  constructor (props) {
    super(props)

    this.state = {}
    this.bound = {
      handleMouseOver: this.handleMouseOver.bind(this),
      handleMouseLeave: this.handleMouseLeave.bind(this)
    }
  }

  handleMouseOver () {
    if (!this.state.highlight) {
      this.setState({highlight: true})
    }
  }

  handleMouseLeave () {
    this.setState({highlight: false})
  }

  render() {
    const {
      children,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      connectDropTarget,
      isOver,
      draggedNode,
      canDrop,
      treeIndex,
      getPrevRow, // Delete from otherProps
      node, // Delete from otherProps
      path, // Delete from otherProps
      lastNode,
      ...otherProps
    } = this.props;

    // Construct the scaffold representing the structure of the tree
    const scaffoldBlockCount = lowerSiblingCounts.length - 1;
    let dropType
    if (draggedNode) {
      if (draggedNode.source) {
        dropType = 'invalidDrop'
      } else if (canDrop && !isOver) {
        dropType = 'validDrop'
      } else if (!canDrop && isOver) {
        dropType = 'invalidDrop'
      }
    }
    return connectDropTarget(
      <div {...otherProps} onMouseOver={this.bound.handleMouseOver} onMouseLeave={this.bound.handleMouseLeave} {...otherProps} onFocus={ () => {} } className={styles.node + (this.state.highlight ? ` ${styles.highlight}` : '') + (lastNode ?  ` ${styles.lastNodeDrop}` : '') + (dropType ? ` ${styles[dropType]}` : '')}>
        <div
          className={styles.nodeContent}
          style={{paddingLeft: scaffoldBlockPxWidth * scaffoldBlockCount}}
        >
          {Children.map(children, child =>
            cloneElement(child, {
              isOver,
              canDrop,
              draggedNode,
            })
          )}
        </div>
      </div>
    );
  }
}

MinimalThemeTreeNodeRenderer.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null,
  lastNode: false
};

MinimalThemeTreeNodeRenderer.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,

  listIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,

  // Drop target
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),

  // used in dndManager
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  lastNode: PropTypes.bool
};

export default MinimalThemeTreeNodeRenderer;
