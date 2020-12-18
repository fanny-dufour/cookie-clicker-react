import React, { useState, useEffect, useCallback } from 'react';
import Amelioration from './Components/Amelioration';
import useInterval from './Hooks/useInterval';
import useLocalStorage from './Hooks/useLocalStorage';

const App = () => {
  const [compteur, setCompteur] = useLocalStorage('compteur', 0);
  const [amelioration, setAmelioration] = useLocalStorage('amelioration', 0);
  const [ameliorationDescription, setAmeliorationDescription] = useLocalStorage(
    'ameliorationDescription',
    ''
  );
  const [seconds, setSeconds] = useLocalStorage('seconds', 60);
  const [disabled, setDisabled] = useState(true);
  const [bonus, setBonus] = useState(() => {
    return Math.floor(Math.random() * (51 - 2));
  });
  const [showBonus, setShowBonus] = useState(false);
  const [position, setPosition] = useState({});
  const [styles, setStyles] = useState({});
  const [positionDiv, setPositionDiv] = useState({});

  /**
   * Fonction qui permet de récupérer la position de l'image principale de cookie sur la page
   */
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setPosition({
        top: node.getBoundingClientRect().top,
        right: node.getBoundingClientRect().right,
        left: node.getBoundingClientRect().left,
        bottom: node.getBoundingClientRect().bottom,
      });
      console.log(node.getBoundingClientRect().right);
    }
  }, []);

  /**
   * Fonction qui mesure le div des améliorations
   */

  const measuredDiv = useCallback((node) => {
    if (node !== null) {
      setPositionDiv({
        right: node.getBoundingClientRect().right,
      });
      console.log(node.getBoundingClientRect().right);
    }
  }, []);

  /**
   * Interval pour afficher le bonus
   */

  useEffect(() => {
    let interval;
    interval = setInterval(() => setShowBonus(true), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * Interval pour faire disparaître le bonus s'il n'est pas cliqué
   */

  useEffect(() => {
    let interval2;
    if (showBonus) {
      calculateBonusPosition();
      interval2 = setInterval(() => setShowBonus(false), 3000);
    }
    return () => {
      clearInterval(interval2);
    };
  }, [showBonus]);

  /**
   * Interval de l'amélioration passive, qui calcule aussi un nombre random pour le bonus
   */

  useInterval(() => {
    if (showBonus) {
      setBonus(Math.floor(Math.random() * (51 - 2)));
    }
    if (amelioration > 1) {
      ameliorationInterval(amelioration);
    }
  }, seconds * 1000);

  const onClickBonus = () => {
    setCompteur(compteur + bonus);
    setShowBonus(false);
  };

  /**
   * Rajoute le montant de l'amélioration passive au compteur
   */

  const ameliorationInterval = (amelioration) => {
    setCompteur(compteur + amelioration);
  };

  /**
   * Fonction du clic sur le cookie, qui gère aussi l'état du bouton d'achat d'amélioration : disabled en-dessous de 20 cookies possédés
   */

  const onClick = () => {
    setCompteur(compteur + 1);
    if (compteur >= 20) {
      setDisabled(false);
    }
  };

  /**
   * Fonction pour acheter des améliorations
   */

  const buy = () => {
    if (seconds > 5) {
      setAmelioration(amelioration + 1);
      setSeconds(seconds - 5);
      setAmeliorationDescription(
        '+' +
          (amelioration + 1) +
          ' toutes les ' +
          (seconds - 5) +
          ' secondes !'
      );
    } else if (seconds === 5) {
      setAmelioration(amelioration + 2);
      setAmeliorationDescription(
        '+' + (amelioration + 2) + ' toutes les ' + seconds + ' secondes !'
      );
    }
    setCompteur(compteur - 20);
    if (compteur - 20 < 20) {
      setDisabled(true);
    }
  };

  /**
   * Réinitialise le local storage et le score
   */

  const clearGame = () => {
    localStorage.clear();
    setCompteur(0);
    setAmelioration(0);
    setAmeliorationDescription('');
    setSeconds(5);
  };

  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  /**
   * Fonction pour calculer la position de top ou de bottom du bonus
   */

  const calculateTopOrBottomPosition = () => {
    let nbRandom = random(1, 3);
    console.log(nbRandom);
    if (nbRandom == 1) {
      setStyles({
        top: random(0, position.top - 10),
      });
    } else if (nbRandom == 2) {
      setStyles({
        bottom: random(0, position.bottom - 10),
      });
    }
  };

  /**
   * Fonction pour calculer la position de left ou de right du bonus
   */

  const calculateLeftOrRightPosition = () => {
    let nbRandom = random(1, 3);
    console.log(nbRandom);
    if (nbRandom == 1) {
      setStyles((styles) => ({
        ...styles,
        left: random(0, position.left - 10),
      }));
    } else if (nbRandom == 2) {
      setStyles((styles) => ({
        ...styles,
        right: random(position.right - 10, positionDiv.right),
      }));
    }
  };

  /**
   * Appelle les deux fonctions pour calculer la position random du bonus
   */

  const calculateBonusPosition = () => {
    setStyles({});
    calculateTopOrBottomPosition();
    calculateLeftOrRightPosition();
  };

  return (
    <div className='flex h-screen justify-around items-center cursor-auto font-mono'>
      {showBonus ? (
        <img
          src='https://images-na.ssl-images-amazon.com/images/I/41VIpkIh%2BTL._AC_SX355_.jpg'
          onClick={() => onClickBonus()}
          alt=''
          className='w-20 absolute'
          style={styles}
        />
      ) : null}

      <div
        className='flex-col flex-grow w-100 h-screen border-r-2 border-black'
        ref={measuredDiv}
      >
        <h2 className='text-center p-20 text-xl font-bold'>
          Cookies : {compteur}
        </h2>
        <img
          src='https://media.istockphoto.com/vectors/cartoon-cute-cookie-icon-isolated-on-white-background-vector-id1142855490?k=6&m=1142855490&s=170667a&w=0&h=wkkwL7LH56KneFN0frVZA0ZXKTQQK0CqLjOXQbbDiKM='
          alt=''
          onClick={() => onClick()}
          ref={measuredRef}
          className='m-auto p-20 place-self-center'
        />
      </div>
      <div className='p-10 border-black'>
        <Amelioration ameliorationDescription={ameliorationDescription} />
        <button
          onClick={() => buy()}
          disabled={disabled}
          className='bg-purple-400 rounded focus:outline-black border-opacity-100 p-2 pl-3 pr-3 mt-2'
        >
          Acheter des améliorations
        </button>
        <button
          onClick={() => clearGame()}
          className='block place-self-center mt-20 ml-20'
        >
          Reset
        </button>
      </div>
      <div className='w-50 ml-8 mr-10 block'></div>
    </div>
  );
};

export default App;
