// import { useHttp } from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import store from '../../store';
import { addHero } from '../heroesList/heroesSlice';
import { allFilters } from '../heroesFilters/filtersSlice';

const HeroesAddForm = () => {
  const [heroName, setName] = useState('');
  const [heroDescr, setDescr] = useState('');
  const [heroElement, setElement] = useState('fire');

  const { filtersLoadingStatus } = useSelector((state) => state.filters);
  const filters = allFilters(store.getState());
  const dispatch = useDispatch();
  // const { request } = useHttp();

  const onSubmit = (e) => {
    e.preventDefault();

    const newHero = {
      id: uuidv4(),
      name: heroName,
      description: heroDescr,
      element: heroElement,
    };

    // request(process.env.PUBLIC_URL + '/json/data.json', 'heroes', 'POST', JSON.stringify(newHero))
    //   .then(() => console.log('ADD HERO'))
    //   .then(() => dispatch(addHero(newHero)))
    //   .catch((err) => console.log(err));

    dispatch(addHero(newHero));
    setName('');
    setDescr('');
    setElement('');
  };

  const renderFilters = (filters, status) => {
    if (status === 'loading') {
      <option>Идёт загрузка...</option>;
    } else if (status === 'error') {
      <option>Ошибка загрузки</option>;
    }

    if (filters && filters.length > 0) {
      return filters.map(({ id, value }) => {
        // eslint-disable-next-line array-callback-return
        if (id === 'all') return;

        return (
          <option key={id} value={id}>
            {value}
          </option>
        );
      });
    }
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          value={heroName}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          onChange={(e) => setDescr(e.target.value)}
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: '130px' }}
          value={heroDescr}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          onChange={(e) => setElement(e.target.value)}
          required
          className="form-select"
          id="element"
          name="element"
          value={heroElement}
        >
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
