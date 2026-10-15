import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useInRouterContext } from 'react-router-dom';
import { useGrants } from '../context/GrantsContext';
import { CATEGORIES } from '../data/grants';

const availableCategories = CATEGORIES.filter((c) => c !== 'All');

const NewGrantFormContent = ({ navigate, onNavigate }) => {
  const { addGrant } = useGrants();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      title: '',
      fundingBody: '',
      category: availableCategories[0] || 'Community & Environment',
      amount: '',
      deadline: '',
      applicant: '',
      description: '',
      eligibility: '',
      contactOfficer: 'Sushma Gogula',
      tags: ''
    }
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['title', 'fundingBody', 'category', 'amount', 'deadline', 'applicant'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['description', 'eligibility', 'contactOfficer'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = (data) => {
    const formattedGrant = {
      ...data,
      amount: Number(data.amount),
      status: 'pending',
      progress: 15
    };
    addGrant(formattedGrant);

    if (onNavigate) {
      onNavigate('/grants');
    } else if (navigate) {
      navigate('/grants');
    }
  };

  const formValues = getValues();

  return (
    <div className="new-grant-form-page" style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          Create New Council Grant
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          City of Harborview • Strategic Investment Intake Workflow
        </p>
      </div>

      {/* Visual Stepper */}
      <div className="stepper" aria-label="Grant submission progress steps">
        <div className="step-line" aria-hidden="true">
          <div
            className="step-line-fill"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          />
        </div>

        <div className={`step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
          <div className="step-label">Basic Information</div>
        </div>

        <div className={`step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
          <div className="step-label">Details & Eligibility</div>
        </div>

        <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Review & Submit</div>
        </div>
      </div>

      {/* Form Container */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                Step 1: Grant Overview & Financials
              </h2>

              <div className="form-group">
                <label htmlFor="title">
                  Grant Program Title <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Harborview West Community Renewable Hub"
                  className={`form-control ${errors.title ? 'error' : ''}`}
                  {...register('title', {
                    required: 'Grant title is mandatory',
                    minLength: { value: 5, message: 'Title must be at least 5 characters' }
                  })}
                />
                {errors.title && <span className="error-message">{errors.title.message}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="applicant">
                    Lead Applicant / Organization <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    id="applicant"
                    type="text"
                    placeholder="e.g. Bellarine Youth Association Inc."
                    className={`form-control ${errors.applicant ? 'error' : ''}`}
                    {...register('applicant', {
                      required: 'Lead applicant organisation is required'
                    })}
                  />
                  {errors.applicant && <span className="error-message">{errors.applicant.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="fundingBody">
                    Funding Authority / Body <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    id="fundingBody"
                    type="text"
                    placeholder="e.g. Victorian State Government / City Fund"
                    className={`form-control ${errors.fundingBody ? 'error' : ''}`}
                    {...register('fundingBody', {
                      required: 'Funding body is required'
                    })}
                  />
                  {errors.fundingBody && <span className="error-message">{errors.fundingBody.message}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="category">
                    Category Stream <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <select
                    id="category"
                    className="form-control"
                    {...register('category', { required: 'Please select a category' })}
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">
                    Funding Amount (AUD) <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="e.g. 50000"
                    min="1"
                    className={`form-control ${errors.amount ? 'error' : ''}`}
                    {...register('amount', {
                      required: 'Grant amount is required',
                      min: { value: 1, message: 'Amount must be greater than $0' },
                      valueAsNumber: true
                    })}
                  />
                  {errors.amount && <span className="error-message">{errors.amount.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">
                    Application Deadline <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    className={`form-control ${errors.deadline ? 'error' : ''}`}
                    {...register('deadline', {
                      required: 'Deadline date is required',
                      validate: (value) => {
                        if (!value) return 'Deadline date is required';
                        const selected = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return selected >= today || 'Deadline must be a future date';
                      }
                    })}
                  />
                  {errors.deadline && <span className="error-message">{errors.deadline.message}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Details & Eligibility */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                Step 2: Project Scope & Guidelines
              </h2>

              <div className="form-group">
                <label htmlFor="description">
                  Grant Scope & Description <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Detail the objectives, community benefits, and deliverable milestones..."
                  className={`form-control ${errors.description ? 'error' : ''}`}
                  {...register('description', {
                    required: 'Grant description is required',
                    minLength: { value: 20, message: 'Please describe in at least 20 characters' }
                  })}
                />
                {errors.description && <span className="error-message">{errors.description.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eligibility">
                  Eligibility Criteria <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <textarea
                  id="eligibility"
                  rows={3}
                  placeholder="Specify eligible legal structures, LGA requirements, co-contribution rules..."
                  className={`form-control ${errors.eligibility ? 'error' : ''}`}
                  {...register('eligibility', {
                    required: 'Eligibility requirements are mandatory'
                  })}
                />
                {errors.eligibility && <span className="error-message">{errors.eligibility.message}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="contactOfficer">
                    Responsible Council Officer <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    id="contactOfficer"
                    type="text"
                    className={`form-control ${errors.contactOfficer ? 'error' : ''}`}
                    {...register('contactOfficer', {
                      required: 'Contact officer is required'
                    })}
                  />
                  {errors.contactOfficer && <span className="error-message">{errors.contactOfficer.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="tags">
                    Tags (comma separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    placeholder="e.g. community, environment, youth"
                    className="form-control"
                    {...register('tags')}
                  />
                  <span className="form-hint">Separate tags with commas</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Submit */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                Step 3: Review & Final Confirmation
              </h2>

              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Please verify all entered grant parameters prior to registering this proposal into the City of Harborview grants ledger.
              </p>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Grant Title</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>{formValues.title}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Applicant</span>
                    <strong>{formValues.applicant}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Funding Body</span>
                    <strong>{formValues.fundingBody}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Category</span>
                    <span style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {formValues.category}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Funding Amount</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-success)' }}>
                      ${Number(formValues.amount).toLocaleString('en-AU')} AUD
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Closing Deadline</span>
                    <strong>{formValues.deadline}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Assigned Officer</span>
                    <strong>{formValues.contactOfficer}</strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Tags</span>
                    <span>{formValues.tags || 'None specified'}</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Scope & Description</span>
                  <p style={{ fontSize: '0.925rem', color: '#334155' }}>{formValues.description}</p>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Eligibility Terms</span>
                  <p style={{ fontSize: '0.925rem', color: '#334155' }}>{formValues.eligibility}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            {currentStep > 1 ? (
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => (onNavigate ? onNavigate('/grants') : navigate ? navigate('/grants') : null)}
              >
                Cancel
              </button>
            )}

            {currentStep < 3 ? (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next: Step {currentStep + 1} →
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669' }}>
                ✓ Confirm & Register Grant
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const NewGrantFormWithRouter = () => {
  const navigate = useNavigate();
  return <NewGrantFormContent navigate={navigate} />;
};

const NewGrantFormWithoutRouter = () => {
  const handleNavigate = (path) => {
    if (typeof window !== 'undefined') window.location.href = path;
  };
  return <NewGrantFormContent onNavigate={handleNavigate} />;
};

const NewGrantForm = () => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <NewGrantFormWithRouter />;
  }
  return <NewGrantFormWithoutRouter />;
};

export default NewGrantForm;
