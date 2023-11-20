import { useEffect, useMemo, useState } from 'react';
import { Column, useTable, useSortBy } from 'react-table';
import { LeaderboardType } from '../../types/LeaderboardType';
import { LeaderboardEntry } from '../../types/LeaderboardEntry';
import { formatDate } from '../../functions/formatDate';
import LoadingCircle from '../../components/LoadingCircle/LoadingCircle';
import './Leaderboard.css';
import calculateRanks from '../../functions/calculateRanks';
import compareDates from '../../functions/compareDates';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardType>([] as LeaderboardType);

  // Fetch leaderboard data
  useEffect(() => {
    const endpoint = 'http://localhost:3000/fetchLeaderboard';
    const session = JSON.parse(sessionStorage.getItem('session')!);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('sessionId', session.sessionId);

    const fetchLeaderboard = async () => {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
      });
      const data = await res.json();
      if (data.status !== 200) {
        alert(data.message);
      }
      else {
        const ldb = data.leaderboard.map((el: LeaderboardEntry) => {
          return {
            ...el,
            lastPlayed: formatDate(el.lastPlayed),
          }
        });
        const rankedLeaderboard = calculateRanks(ldb);
        setLeaderboard(rankedLeaderboard);
      }
    };

    fetchLeaderboard();
  }, []);

  // define columns
  const columns = useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rank',
        id: 'rank',
      },
      // define custom cell for avatar html
      {
        Header: 'Avatar',
        accessor: 'avatar',
        Cell: ({ cell: { value } }) => {
          return <img className="userAvatar" src={ `images/${ value}.png` } alt="avatar" />
        },
      },
      {
        Header: 'Username',
        accessor: 'username',
        Cell: ({ cell: { value } }) => {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
      },
      {
        Header: 'Last Played',
        accessor: 'lastPlayed',
        sortType: compareDates,
      },
      {
        Header: 'Games Played',
        accessor: 'gamesPlayed',
      },
      {
        Header: 'Score',
        accessor: 'points',
      },
    ],
    []
  ) as Column<LeaderboardEntry>[];

  // React Table (default sorting by rank)
  const tableInstance = useTable<LeaderboardEntry>(
    { columns, data: leaderboard, initialState: { sortBy: [{ id: 'rank', desc: false }] } },
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className="leaderboard">
      <h2>Global Leaderboard</h2>
      { 
        leaderboard.length === 0 ?
        <LoadingCircle /> :
        <table {...getTableProps()} className="ldb-table">
          <thead className='ldb-table-head'>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className='ldb-table-row'>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className='ldb-table-header'>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className='ldb-table-body'>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className='ldb-table-row'>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} className='ldb-table-data'>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      }
    </div>
  );
}

export default Leaderboard;
