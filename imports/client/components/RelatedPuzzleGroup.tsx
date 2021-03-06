import { _ } from 'meteor/underscore';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { PuzzleType } from '../../lib/schemas/puzzles';
import { TagType } from '../../lib/schemas/tags';
import PuzzleList from './PuzzleList';
import Tag from './Tag';
import puzzleInterestingness from './puzzleInterestingness';

/* eslint-disable max-len */

function sortPuzzlesByRelevanceWithinPuzzleGroup(
  puzzles: PuzzleType[],
  sharedTag: TagType,
  indexedTags: Record<string, TagType>
) {
  // If sharedTag is a meta:<something> tag, sort a puzzle with a meta-for:<something> tag at top.
  let group: string;
  if (sharedTag.name.lastIndexOf('group:', 0) === 0) {
    group = sharedTag.name.slice('group:'.length);
  }

  const sortedPuzzles = puzzles.slice(0);
  sortedPuzzles.sort((a, b) => {
    const ia = puzzleInterestingness(a, indexedTags, group);
    const ib = puzzleInterestingness(b, indexedTags, group);
    if (ia !== ib) {
      return ia - ib;
    } else {
      // Sort puzzles by creation time otherwise.
      return +a.createdAt - +b.createdAt;
    }
  });

  return sortedPuzzles;
}

interface RelatedPuzzleGroupProps {
  sharedTag: TagType;
  relatedPuzzles: PuzzleType[];
  allTags: TagType[];
  includeCount?: boolean;
  layout: 'grid' | 'table';
  canUpdate: boolean;
}

interface RelatedPuzzleGroupState {
  collapsed: boolean;
}

class RelatedPuzzleGroup extends React.Component<RelatedPuzzleGroupProps, RelatedPuzzleGroupState> {
  static displayName = 'RelatedPuzzleGroup';

  constructor(props: RelatedPuzzleGroupProps) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  toggleCollapse = () => {
    this.setState((prevState) => ({
      collapsed: !prevState.collapsed,
    }));
  };

  render() {
    // Sort the puzzles within each tag group by interestingness.  For instance, metas
    // should probably be at the top of the group, then of the round puzzles, unsolved should
    // maybe sort above solved, and then perhaps by unlock order.
    const tagIndex = _.indexBy(this.props.allTags, '_id');
    const sortedPuzzles = sortPuzzlesByRelevanceWithinPuzzleGroup(this.props.relatedPuzzles, this.props.sharedTag, tagIndex);

    return (
      <div className="puzzle-group">
        <div className="puzzle-group-header" onClick={this.toggleCollapse}>
          <FontAwesomeIcon fixedWidth icon={this.state.collapsed ? faCaretRight : faCaretDown} />
          <Tag tag={this.props.sharedTag} linkToSearch={false} />
          {this.props.includeCount && <span>{`(${this.props.relatedPuzzles.length} other ${this.props.relatedPuzzles.length === 1 ? 'puzzle' : 'puzzles'})`}</span>}
        </div>
        {this.state.collapsed ? null : (
          <div className="puzzle-list-wrapper">
            <PuzzleList
              puzzles={sortedPuzzles}
              allTags={this.props.allTags}
              layout={this.props.layout}
              canUpdate={this.props.canUpdate}
              suppressTags={[this.props.sharedTag._id]}
            />
          </div>
        )}
      </div>
    );
  }
}

export default RelatedPuzzleGroup;
