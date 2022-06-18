import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import store from '../../store';
import { fetchFilters, activeFilterChanged, allFilters } from './filtersSlice';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {
  const filters = allFilters(store.getState());
  const { filtersLoadingStatus, activeFilter } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilters());
    // eslint-disable-next-line
  }, []);

  if (filtersLoadingStatus === 'loading') {
    return <Spinner />;
  } else if (filtersLoadingStatus === 'error') {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderFilters = (filters) => {
    if (filters.length === 0) {
      return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
    }

    return filters.map(({ id, value, className }) => {
      const btnClass = classNames('btn', className, {
        active: id === activeFilter,
      });
      return (
        <button
          key={id}
          id={id}
          className={btnClass}
          onClick={() => dispatch(activeFilterChanged(id))}
        >
          {value}
        </button>
      );
    });
  };

  const elements = renderFilters(filters);

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{elements}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
