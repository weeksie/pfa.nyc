defmodule PFA.Repo.Migrations.CreatePage do
  use Ecto.Migration

  def change do
    create table(:pages) do
      add :url, :string
      add :content, :text

      timestamps()
    end

  end
end
