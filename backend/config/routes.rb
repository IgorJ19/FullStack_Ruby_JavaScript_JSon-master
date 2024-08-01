Rails.application.routes.draw do
  resources :users
  devise_for :users, defaults: { format: :json }

  resources :certificates
  devise_for :certificates, defaults: { format: :json }
  delete '/certificates/:id', to: 'certificates#destroy'
  get 'users/all_users', to: 'users#all_users'
end

