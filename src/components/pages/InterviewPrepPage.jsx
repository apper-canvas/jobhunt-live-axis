import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { interviewService } from '@/services/api/interviewService';
import { cn } from '@/utils/cn';

const InterviewPrepPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'software-engineering', label: 'Software Engineering' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'product-management', label: 'Product Management' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'design', label: 'Design' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'general', label: 'General' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedCategory, selectedDifficulty]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await interviewService.getAll();
      setQuestions(data);
    } catch (err) {
      setError('Failed to load interview questions. Please try again.');
      toast.error('Failed to load interview questions');
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    setFilteredQuestions(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    toast.success(`Filtered by ${categories.find(c => c.value === category)?.label}`);
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    toast.success(`Filtered by ${difficulties.find(d => d.value === difficulty)?.label}`);
  };

  const handleQuestionToggle = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const startPracticeMode = () => {
    if (filteredQuestions.length === 0) {
      toast.error('No questions available for practice');
      return;
    }
    setPracticeMode(true);
    setCurrentPracticeIndex(0);
    toast.success('Practice mode started!');
  };

  const nextPracticeQuestion = () => {
    if (currentPracticeIndex < filteredQuestions.length - 1) {
      setCurrentPracticeIndex(currentPracticeIndex + 1);
    } else {
      toast.success('Practice session completed!');
      setPracticeMode(false);
    }
  };

  const previousPracticeQuestion = () => {
    if (currentPracticeIndex > 0) {
      setCurrentPracticeIndex(currentPracticeIndex - 1);
    }
  };

  const exitPracticeMode = () => {
    setPracticeMode(false);
    toast.info('Practice mode ended');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuestions} />;

  if (practiceMode) {
    const currentQuestion = filteredQuestions[currentPracticeIndex];
    
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="max-w-4xl mx-auto">
          {/* Practice Mode Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={exitPracticeMode}
                icon="X"
              >
                Exit Practice
              </Button>
              <div className="text-sm text-gray-600">
                Question {currentPracticeIndex + 1} of {filteredQuestions.length}
              </div>
            </div>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mx-4">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentPracticeIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Practice Question Card */}
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">
                  {categories.find(c => c.value === currentQuestion.category)?.label}
                </Badge>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Points to Cover:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {currentQuestion.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Sample Answer:
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {currentQuestion.sampleAnswer}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Pro Tips:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Practice Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={previousPracticeQuestion}
              disabled={currentPracticeIndex === 0}
              icon="ChevronLeft"
            >
              Previous
            </Button>
            <Button
              onClick={nextPracticeQuestion}
              icon={currentPracticeIndex === filteredQuestions.length - 1 ? "Check" : "ChevronRight"}
            >
              {currentPracticeIndex === filteredQuestions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            Interview Preparation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master your interviews with curated questions, expert tips, and practice sessions 
            tailored to your industry and role.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <Input
                type="text"
                placeholder="Search questions, categories, or topics..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                icon="Search"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
                className="input-field"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredQuestions.length} questions found
            </div>
            <Button
              onClick={startPracticeMode}
              disabled={filteredQuestions.length === 0}
              icon="Play"
            >
              Start Practice Session
            </Button>
          </div>
        </Card>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Empty
            icon="BookOpen"
            title="No questions found"
            description="Try adjusting your search or filter criteria"
          />
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card key={question.Id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {categories.find(c => c.value === question.category)?.label}
                      </Badge>
                      {question.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {question.question}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleQuestionToggle(question.Id)}
                    icon={expandedQuestion === question.Id ? "ChevronUp" : "ChevronDown"}
                  >
                    {expandedQuestion === question.Id ? "Hide" : "Show"} Details
                  </Button>
                </div>

                {expandedQuestion === question.Id && (
                  <div className="space-y-6 pt-4 border-t border-gray-200">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Key Points to Cover:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {question.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Sample Answer:
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">
                          {question.sampleAnswer}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Pro Tips:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {question.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrepPage;