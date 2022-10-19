Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get 'index/:mode', to: "home#index"
  get 'index', to: "home#index"
  get 'show/:i', to: "home#show", as: "show"
  get 'upload', to: "home#upload"
  get 'about', to: "home#about"
  get 'about-collection', to: "home#about_collection"
  
  root 'home#start'
end
