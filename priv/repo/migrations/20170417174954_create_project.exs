defmodule PFA.Repo.Migrations.CreateProject do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string
      add :url, :string
      add :description, :text
      add :image, :string

      timestamps()
    end

  end
end
