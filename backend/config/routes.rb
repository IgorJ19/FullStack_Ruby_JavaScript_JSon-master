Rails.application.routes.draw do
  resources :users
  devise_for :users, defaults: { format: :json }
  get '/all_users', to: 'users#all_users'

  resources :certificates
  devise_for :certificates, defaults: { format: :json }
  delete '/certificates/:id', to: 'certificates#destroy'

end

