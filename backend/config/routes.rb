Rails.application.routes.draw do
  resources :users
  devise_for :users, defaults: { format: :json }

  resources :certificates
  devise_for :certificates, defaults: { format: :json }
  delete '/certificates/:id', to: 'certificates#destroy'
end

