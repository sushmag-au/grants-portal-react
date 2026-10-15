import React, { createContext, useContext, useState, useEffect } from 'react';
import { GRANTS_DATA } from '../data/grants';

const GrantsContext = createContext(null);

export const GrantsProvider = ({ children }) => {
  const [grants, setGrants] = useState(() => {
    const saved = localStorage.getItem('geelong_grants_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved grants', e);
      }
    }
    return GRANTS_DATA;
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('geelong_grants_data', JSON.stringify(grants));
  }, [grants]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addGrant = (newGrant) => {
    const id = (grants.length + 1).toString();
    const createdGrant = {
      ...newGrant,
      id,
      amountAwarded: newGrant.status === 'awarded' ? Number(newGrant.amount) : 0,
      progress: newGrant.status === 'awarded' ? 100 : (newGrant.progress || 10),
      submittedDate: newGrant.submittedDate || new Date().toISOString().split('T')[0],
      tags: Array.isArray(newGrant.tags)
        ? newGrant.tags
        : typeof newGrant.tags === 'string'
        ? newGrant.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []
    };
    setGrants((prev) => [createdGrant, ...prev]);
    showToast(`Grant "${createdGrant.title}" was successfully submitted!`);
    return createdGrant;
  };

  const updateGrant = (id, fields) => {
    setGrants((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...fields };
          if (fields.status === 'awarded' && !fields.amountAwarded) {
            updated.amountAwarded = updated.amount;
            updated.progress = 100;
          }
          return updated;
        }
        return g;
      })
    );
    showToast(`Grant #${id} was updated successfully.`);
  };

  const deleteGrant = (id) => {
    setGrants((prev) => prev.filter((g) => g.id !== id));
    showToast(`Grant #${id} was archived.`);
  };

  const getGrantById = (id) => {
    return grants.find((g) => g.id === id);
  };

  return (
    <GrantsContext.Provider
      value={{
        grants,
        addGrant,
        updateGrant,
        deleteGrant,
        getGrantById,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
      {toastMessage && (
        <div className="toast-success" role="status" aria-live="polite">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </GrantsContext.Provider>
  );
};

export const useGrants = () => {
  const context = useContext(GrantsContext);
  if (!context) {
    // Provide safe defaults so isolated component unit tests don't crash
    return {
      grants: GRANTS_DATA,
      addGrant: () => {},
      updateGrant: () => {},
      deleteGrant: () => {},
      getGrantById: (id) => GRANTS_DATA.find((g) => g.id === id),
      toastMessage: null,
      setToastMessage: () => {}
    };
  }
  return context;
};

export default GrantsContext;
