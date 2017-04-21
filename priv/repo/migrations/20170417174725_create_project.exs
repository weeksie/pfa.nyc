defmodule Pfa.Repo.Migrations.CreateProject do
  use Ecto.Migration

  def change do
    create table(:description) do
 
      add :image, :string

      timestamps()
    end

  end
end
